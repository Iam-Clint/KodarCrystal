import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseLocalProjects, localProjectUrl } from '../src/lib/projects.ts';
const project={id:'project-one',name:'Same name',type:'Portfolio',updated:'Just now',color:'from-stone-500 to-zinc-800'};
test('valid projects and an intentionally empty list survive persistence',()=>{
  assert.deepEqual(parseLocalProjects(JSON.stringify([project,{...project,id:'project-two'}])),[project,{...project,id:'project-two'}]);
  assert.deepEqual(parseLocalProjects('[]'),[]);
});
test('corrupt or duplicate project IDs recover to usable seeded data',()=>{
  for(const value of ['bad JSON','{}',JSON.stringify([{...project,id:''}]),JSON.stringify([project,project])]){
    const recovered=parseLocalProjects(value);assert.ok(recovered.length>0);assert.equal(new Set(recovered.map(p=>p.id)).size,recovered.length);
  }
});
test('workspace links identify projects by stable ID and encode the URL',()=>assert.equal(localProjectUrl('project & one'),'/workspace?projectId=project%20%26%20one'));
