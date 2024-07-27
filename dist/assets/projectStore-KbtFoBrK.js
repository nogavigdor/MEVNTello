import{A as a,B as s}from"./index-DMryOHvS.js";const i=a("projects",{state:()=>({projects:[]}),actions:{async fetchProjects(){try{const e=await s.get("/projects");return this.projects=e.data,this.projects}catch(e){throw console.error("Failed to fetch projects:",e),e}},async createProject(e){var t;try{const r=await s.post("/projects",e);this.projects.push(r.data)}catch(r){throw console.error("Failed to create project:",(t=r.response)==null?void 0:t.data),r}},async updateProject(e){try{const t=await s.put(`/projects/${e._id}`,e),r=this.projects.findIndex(o=>o._id===e._id);r!==-1&&(this.projects[r]=t.data)}catch(t){throw console.error("Failed to update project:",t),t}},async deleteProject(e){try{await s.delete(`/projects/${e}`),this.projects=this.projects.filter(t=>t._id!==e)}catch(t){throw console.error("Failed to delete project:",t),t}},async addTeamMember(e,t){try{const r=await s.post(`/projects/${e}/team`,{memberId:t}),o=this.projects.findIndex(c=>c._id===e);o!==-1&&(this.projects[o]=r.data)}catch(r){throw console.error("Failed to add team member:",r),r}},async removeTeamMember(e,t){try{const r=await s.delete(`/projects/${e}/team/${t}`),o=this.projects.findIndex(c=>c._id===e);o!==-1&&(this.projects[o]=r.data)}catch(r){throw console.error("Failed to remove team member:",r),r}},async getProjectById(e){try{return(await s.get(`/projects/${e}`)).data}catch(t){throw console.error("Failed to fetch project:",t),t}}}});export{i as u};