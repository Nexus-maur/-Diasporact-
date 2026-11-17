/* Faux client Supabase en mémoire, pour tester le câblage de l'interface (les règles de sécurité sont testées en SQL). */
module.exports=function makeMock(opts){
  var uid=0;function id(){return 'id-'+(++uid);}
  var DB={profiles:[],canals:[],canal_members:[],invites:[],projects:[],milestones:[],tasks:[],project_team:[],comments:[],follows:[],proposals:[],helps:[],announcements:[],ann_reads:[],badge_requests:[],badge_grants:[],notifications:[]};
  ['edu','inv','san','adm','num','cul'].forEach(function(k,i){DB.canals.push({id:k,ico:'hash',name_fr:k,name_ar:k,desc_fr:'',desc_ar:'',wa_link:null,sort:i});});
  var session=opts.session?{user:{id:opts.session}}:null;
  var calls=[];
  function me(){return session?DB.profiles.filter(function(p){return p.auth_uid===session.user.id;})[0]:null;}
  function views(name){
    if(name==='public_profiles')return DB.profiles.map(function(p){return {id:p.id,pseudo:p.pseudo,country:p.country,show_honor:p.show_honor,is_admin:p.is_admin,is_ref:p.is_ref};});
    if(name==='canal_stats'){var o={};DB.canal_members.filter(function(m){return m.status==='member';}).forEach(function(m){o[m.canal_id]=(o[m.canal_id]||0)+1;});return Object.keys(o).map(function(k){return {canal_id:k,members:o[k]};});}
    if(name==='canal_mods')return DB.canal_members.filter(function(m){return m.status==='member'&&(m.is_moderator||m.is_relay);}).map(function(m){return {canal_id:m.canal_id,pseudo:DB.profiles.filter(function(p){return p.id===m.user_id;})[0].pseudo,is_moderator:m.is_moderator,is_relay:m.is_relay};});
    if(name==='ann_read_counts'){var c={};DB.ann_reads.forEach(function(r){c[r.ann_id]=(c[r.ann_id]||0)+1;});return Object.keys(c).map(function(k){return {ann_id:k,n:c[k]};});}
    if(name==='engagement')return DB.profiles.map(function(p){return {user_id:p.id,reads:DB.ann_reads.filter(function(r){return r.user_id===p.id;}).length,tasks:DB.tasks.filter(function(t){return t.assignee_id===p.id&&t.status==='done';}).length,proj:DB.projects.filter(function(x){return x.owner_id===p.id;}).length,help:DB.helps.filter(function(h){return h.claimed_by===p.id&&h.status==='solved';}).length,links:DB.proposals.filter(function(x){return x.from_user===p.id;}).length};});
    if(name==='skills_directory')return DB.profiles.filter(function(p){return p.matching;}).map(function(p){return {id:p.id,pseudo:p.pseudo,country:p.country,skills:p.skills};});
    return DB[name];
  }
  function Q(name){
    var st={op:'select',filters:[],single:false,maybe:false,payload:null,order:null,lim:null,retSel:false};
    var q={
      select:function(){if(st.op!=='select')st.retSel=true;return q;},
      eq:function(k,v){st.filters.push([k,v]);return q;},
      order:function(k,o){st.order=[k,!(o&&o.ascending===false)];return q;},
      limit:function(n){st.lim=n;return q;},
      maybeSingle:function(){st.maybe=true;return q;},single:function(){st.single=true;return q;},
      insert:function(p){st.op='insert';st.payload=p;return q;},update:function(p){st.op='update';st.payload=p;return q;},upsert:function(p){st.op='upsert';st.payload=p;return q;},
      then:function(res,rej){return Promise.resolve(run()).then(res,rej);}
    };
    function run(){
      calls.push(name+':'+st.op);
      var rows=views(name);
      function match(r){return st.filters.every(function(f){return r[f[0]]===f[1];});}
      if(st.op==='insert'){var arr=Array.isArray(st.payload)?st.payload:[st.payload],out=[];arr.forEach(function(p){var r=Object.assign({id:id(),created_at:new Date().toISOString()},defaults(name),p);DB[name].push(r);out.push(r);if(name==='comments')notifyComment(r);});return {data:st.single?out[0]:(st.retSel?out:null),error:null};}
      if(st.op==='update'){rows.filter(match).forEach(function(r){Object.assign(r,st.payload);});return {data:null,error:null};}
      if(st.op==='upsert'){var ex=DB[name].filter(function(r){return r.project_id===st.payload.project_id&&r.user_id===st.payload.user_id;})[0];if(ex)Object.assign(ex,st.payload);else DB[name].push(Object.assign({},st.payload));return {data:null,error:null};}
      var res=rows.filter(match).slice();
      if(st.order){var k=st.order[0],asc=st.order[1];res.sort(function(a,b){return (a[k]>b[k]?1:a[k]<b[k]?-1:0)*(asc?1:-1);});}
      if(st.lim)res=res.slice(0,st.lim);
      if(st.maybe)return {data:res[0]||null,error:null};
      return {data:res,error:null};
    }
    return q;
  }
  function defaults(name){
    if(name==='tasks')return {status:'todo',assignee_id:null};
    if(name==='projects')return {status:'recruit',needs:[],title_ar:null,objective_ar:null};
    if(name==='helps')return {status:'open',claimed_by:null,reply:null};
    if(name==='milestones')return {done:false};
    return {};
  }
  function notifyComment(r){var p=DB.projects.filter(function(x){return x.id===r.project_id;})[0];if(p&&p.owner_id!==r.author_id)DB.notifications.push({id:id(),user_id:p.owner_id,kind:'comment',ref:p.id,body:p.title,read:false,created_at:new Date().toISOString()});}
  function err(m){return {data:null,error:{message:m}};}
  var RPC={
    pseudo_available:function(a){return !DB.profiles.some(function(p){return p.pseudo===a.p;});},
    peek_invite:function(a){var i=DB.invites.filter(function(x){return x.code===a.p_code&&x.active;})[0];if(!i)return null;var c=DB.canals.filter(function(x){return x.id===i.canal_id;})[0];return {kind:i.kind,canal:i.canal_id,canal_fr:c&&c.name_fr,canal_ar:c&&c.name_ar};},
    redeem_invite:function(a){
      var i=DB.invites.filter(function(x){return x.code===a.p_code&&x.active;})[0];if(!i)throw new Error('invalid_invite');
      if(i.kind==='recovery'){DB.profiles.forEach(function(p){if(p.auth_uid===session.user.id)p.auth_uid=null;});DB.profiles.filter(function(p){return p.id===i.target_user;})[0].auth_uid=session.user.id;i.active=false;return {ok:true};}
      var ex=me();if(ex){DB.canal_members.push({canal_id:i.canal_id,user_id:ex.id,status:'member',is_moderator:false,is_relay:false});return {ok:true};}
      if(DB.profiles.some(function(p){return p.pseudo===a.p_pseudo;}))throw new Error('pseudo_taken');
      var p={id:id(),auth_uid:session.user.id,pseudo:a.p_pseudo,country:a.p_country||'',lang:'fr',skills:[],matching:false,show_honor:true,is_admin:i.kind==='admin',is_ref:false};DB.profiles.push(p);
      if(i.canal_id)DB.canal_members.push({canal_id:i.canal_id,user_id:p.id,status:'member',is_moderator:false,is_relay:false});
      if(i.kind!=='join')i.active=false;DB.notifications.push({id:id(),user_id:p.id,kind:'welcome',ref:null,body:'',read:false,created_at:new Date().toISOString()});return {ok:true};},
    request_join:function(a){DB.canal_members.push({canal_id:a.p_canal,user_id:me().id,status:'pending',is_moderator:false,is_relay:false});},
    decide_join:function(a){var m=DB.canal_members.filter(function(x){return x.canal_id===a.p_canal&&x.user_id===a.p_user;})[0];m.status=a.p_accept?'member':'refused';},
    mark_read:function(a){if(!DB.ann_reads.some(function(r){return r.ann_id===a.p_ann&&r.user_id===me().id;}))DB.ann_reads.push({ann_id:a.p_ann,user_id:me().id});},
    take_task:function(a){var t=DB.tasks.filter(function(x){return x.id===a.p_task;})[0];t.assignee_id=me().id;t.status='doing';},
    set_task_status:function(a){DB.tasks.filter(function(x){return x.id===a.p_task;})[0].status=a.p_status;},
    claim_help:function(a){var h=DB.helps.filter(function(x){return x.id===a.p_help;})[0];h.status='doing';h.claimed_by=me().id;},
    solve_help:function(a){var h=DB.helps.filter(function(x){return x.id===a.p_help;})[0];h.status='solved';if(a.p_reply)h.reply=a.p_reply;},
    rotate_canal_invite:function(a){DB.invites.forEach(function(i){if(i.canal_id===a.p_canal)i.active=false;});var code=a.p_canal+'-'+id();DB.invites.push({code:code,kind:'join',canal_id:a.p_canal,active:true,created_at:new Date().toISOString()});return code;},
    create_recovery_invite:function(a){var p=DB.profiles.filter(function(x){return x.pseudo===a.p_pseudo;})[0];if(!p)throw new Error('unknown_pseudo');var code='retour-'+id();DB.invites.push({code:code,kind:'recovery',target_user:p.id,active:true});return code;},
    set_role:function(a){var p=DB.profiles.filter(function(x){return x.pseudo===a.p_pseudo;})[0];if(!p)throw new Error('unknown_pseudo');DB.canal_members=DB.canal_members.filter(function(m){return !(m.canal_id===a.p_canal&&m.user_id===p.id);});DB.canal_members.push({canal_id:a.p_canal,user_id:p.id,status:'member',is_moderator:a.p_moderator,is_relay:a.p_relay});},
    set_referent:function(a){DB.profiles.filter(function(x){return x.pseudo===a.p_pseudo;})[0].is_ref=a.p_on;},
    set_canal_wa:function(a){DB.canals.filter(function(c){return c.id===a.p_canal;})[0].wa_link=a.p_link||null;},
    join_team:function(a){DB.project_team.push({project_id:a.p_project,user_id:me().id});},
    decide_badge:function(a){var r=DB.badge_requests.filter(function(x){return x.id===a.p_req;})[0];r.status=a.p_grant?'granted':'denied';if(a.p_grant)DB.badge_grants.push({user_id:r.user_id,type:r.type});},
    delete_my_account:function(){DB.profiles=DB.profiles.filter(function(p){return p!==me();});}
  };
  var client={
    auth:{getSession:function(){return Promise.resolve({data:{session:session}});},
      signInAnonymously:function(){session={user:{id:'anon-'+id()}};return Promise.resolve({data:{session:session},error:null});},
      signOut:function(){session=null;return Promise.resolve({error:null});}},
    from:Q,
    rpc:function(n,a){calls.push('rpc:'+n);try{var r=RPC[n](a||{});return Promise.resolve({data:r===undefined?null:r,error:null});}catch(e){return Promise.resolve(err(e.message));}}
  };
  return {DB:DB,client:client,calls:calls,id:id,setSession:function(u){session=u?{user:{id:u}}:null;},seed:opts.seed};
};
