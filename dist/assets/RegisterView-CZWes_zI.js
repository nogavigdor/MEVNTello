import{d,r as f,u as g,e as h,o as u,c as m,b as e,w,f as r,g as i,v as a,h as b}from"./index-DMryOHvS.js";const v={class:"min-h-screen bg-gray-100 flex items-center justify-center font-sans"},x={class:"bg-white p-8 rounded-lg shadow-md w-full max-w-md"},y=e("h1",{class:"text-3xl font-bold mb-6 text-primary"},"Register",-1),k={class:"mb-4 relative"},R=e("label",{class:"block text-gray-700 mb-1"},"Username",-1),U={class:"flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary"},V={class:"mb-4 relative"},q=e("label",{class:"block text-gray-700 mb-1"},"Email",-1),B={class:"flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary"},S={class:"mb-4 relative"},$=e("label",{class:"block text-gray-700 mb-1"},"Password",-1),C={class:"flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary"},E=e("button",{type:"submit",class:"w-full bg-primary text-white p-3 rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"}," Register ",-1),M=d({__name:"UserRegisterForm",setup(p){const s=f({username:"",email:"",password:""}),l=g(),_=async()=>{try{await l.register(s.value),alert("Registration successful"),b.push("/login")}catch(c){alert("Registration failed"),console.error(c)}};return(c,t)=>{const n=h("font-awesome-icon");return u(),m("div",v,[e("div",x,[y,e("form",{onSubmit:w(_,["prevent"])},[e("div",k,[R,e("div",U,[r(n,{icon:"user",class:"w-5 h-5 text-primary mx-3"}),i(e("input",{"onUpdate:modelValue":t[0]||(t[0]=o=>s.value.username=o),type:"text",class:"w-full p-3 pl-10 pr-3 focus:outline-none rounded-lg",required:""},null,512),[[a,s.value.username]])])]),e("div",V,[q,e("div",B,[r(n,{icon:"envelope",class:"w-5 h-5 text-primary mx-3"}),i(e("input",{"onUpdate:modelValue":t[1]||(t[1]=o=>s.value.email=o),type:"email",class:"w-full p-3 pl-10 pr-3 focus:outline-none rounded-lg",required:""},null,512),[[a,s.value.email]])])]),e("div",S,[$,e("div",C,[r(n,{icon:"lock",class:"w-5 h-5 text-primary mx-3"}),i(e("input",{"onUpdate:modelValue":t[2]||(t[2]=o=>s.value.password=o),type:"password",class:"w-full p-3 pl-10 pr-3 focus:outline-none rounded-lg",required:""},null,512),[[a,s.value.password]])])]),E],32)])])}}}),N={class:"font-sans"},j={class:"container mx-auto mt-4"},F=d({__name:"RegisterView",setup(p){return(s,l)=>(u(),m("div",N,[e("div",j,[r(M)])]))}});export{F as default};