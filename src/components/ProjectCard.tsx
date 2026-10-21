import { memo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { MoreVertical, Pencil, Copy, Trash2, ExternalLink, Download, Share2, Folder, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
export type Project = { id: string; name: string; type: string; updated: string; color: string; folder?: string };
export const ProjectCard = memo(function ProjectCard({ p, i, onUpdate, onDuplicate, onDelete }: {p:Project;i:number;onUpdate:(id:string,patch:Partial<Project>)=>void;onDuplicate:(p:Project)=>void;onDelete:(id:string)=>void}) {
  const [editing,setEditing] = useState(false);
  const [name,setName] = useState(p.name);
  const [deleting,setDeleting] = useState(false);
  const save = () => {if (!name.trim()) return; onUpdate(p.id,{name:name.trim()});setEditing(false);};
  return <motion.article initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.35,ease:'easeOut',delay:i*0.06}} className="surface group relative overflow-hidden rounded-lg">
    <DropdownMenu><DropdownMenuTrigger asChild><Button size="icon" variant="secondary" aria-label={`Options for ${p.name}`} className="project-menu-trigger absolute right-2 top-2 z-10 h-11 w-11 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56">
      <DropdownMenuItem asChild className="min-h-11"><Link to="/workspace"><ExternalLink />Open in workspace</Link></DropdownMenuItem>
      <DropdownMenuItem className="min-h-11" onSelect={() => {setName(p.name);setEditing(true);}}><Pencil />Rename</DropdownMenuItem>
      <DropdownMenuItem className="min-h-11" onSelect={() => onDuplicate(p)}><Copy />Duplicate</DropdownMenuItem>
      <DropdownMenuSub><DropdownMenuSubTrigger className="min-h-11"><Download />Export code</DropdownMenuSubTrigger><DropdownMenuSubContent>{['React','Flutter','HTML'].map(f => <DropdownMenuItem key={f} className="min-h-11" onSelect={() => toast.success(`${f} export ready — demo only`)}>{f}</DropdownMenuItem>)}</DropdownMenuSubContent></DropdownMenuSub>
      <DropdownMenuItem className="min-h-11" onSelect={async () => {try {await navigator.clipboard.writeText(`https://crystal.dev/share/${p.id}`);toast.success('Link copied!');} catch {toast.error('Could not copy link');}}}><Share2 />Share</DropdownMenuItem>
      <DropdownMenuSub><DropdownMenuSubTrigger className="min-h-11"><Folder />Move to folder</DropdownMenuSubTrigger><DropdownMenuSubContent>{['Personal','Client Work','Archive'].map(f => <DropdownMenuItem className="min-h-11" key={f} onSelect={() => onUpdate(p.id,{folder:f})}>{p.folder === f && <Check />}{f}</DropdownMenuItem>)}</DropdownMenuSubContent></DropdownMenuSub>
      <DropdownMenuSeparator /><DropdownMenuItem className="min-h-11 text-destructive focus:text-destructive" onSelect={() => setDeleting(true)}><Trash2 />Delete</DropdownMenuItem>
    </DropdownMenuContent></DropdownMenu>
    <Link to="/workspace" aria-label={`Open ${p.name}`} className={`block aspect-[16/9] bg-gradient-to-br ${p.color}`} />
    <div className="p-3">{editing ? <form onSubmit={e => {e.preventDefault();save();}} className="space-y-2"><input autoFocus aria-label="Project name" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => {if(e.key === 'Escape')setEditing(false);}} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm" /><div className="flex gap-2"><Button type="submit" disabled={!name.trim()}>Save</Button><Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancel</Button></div></form> : <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2"><div className="min-w-0"><h3 className="truncate font-sans text-sm font-medium">{p.name}</h3><p className="truncate text-xs text-muted-foreground">{p.type}</p></div><span className="shrink-0 text-[11px] text-muted-foreground">{p.updated}</span></div>}{p.folder && <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs"><Folder className="h-3 w-3" />{p.folder}</span>}{deleting && <div className="mt-3 border-t border-border pt-3"><p className="text-sm">Delete project?</p><div className="mt-2 flex gap-2"><Button variant="outline" onClick={() => setDeleting(false)}>Cancel</Button><Button variant="destructive" onClick={() => onDelete(p.id)}>Delete</Button></div></div>}</div>
  </motion.article>;
});
