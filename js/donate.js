//Scroll Header

window.addEventListener('scroll',()=>{
  const scroll = document.documentElement.scrollTop;
  const header = document.getElementById('header');
  const headerContainer = document.getElementById('header-container');
  const headerPrincipal = document.getElementById('header-principal');
  if(scroll > 1){
    headerPrincipal.classList.add('scroll-header-principal')
    header.classList.add('scroll-header');
    headerContainer.classList.add('header-container-scroll')

  }else{
    headerPrincipal.classList.remove('scroll-header-principal')
    header.classList.remove('scroll-header')
    headerContainer.classList.remove('header-container-scroll')

  }
})


const buttonUp = document.getElementById('button-up')
let scrollUp = ()=>{
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
}
buttonUp.addEventListener('click', scrollUp)

window.addEventListener('scroll',()=>{
  const currentScroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight;
  if(currentScroll > height/6){
    buttonUp.style.transform = "scale(1)"
  }else{
        buttonUp.style.transform = "scale(0)"
  }
})



//Menú

const burger = document.getElementById('burger')
const menu = document.getElementById('menu')
const close = document.querySelector('.fa-times')

burger.addEventListener('click',()=>{
  menu.classList.add('slide')
  burger.classList.add('opacity')
})
close.addEventListener('click',()=>{
  menu.classList.remove('slide')
  burger.classList.remove('opacity')
  proyectsMenu.classList.remove('visible')
})


// Menú inferior



const nosotros = document.getElementById('nosotros')
const nosotrosContainer = document.getElementById('nosotros-container')
const iconNosotros = document.getElementById('icon-nosotros')

nosotros.addEventListener('click',()=>{
  nosotrosContainer.classList.toggle('visible')
  iconNosotros.classList.toggle('visible')
})


const proyectos = document.getElementById('proyectos')
const proyectosContainer = document.getElementById('proyectos-container')
const icon = document.getElementById('icon')

proyectos.addEventListener('click',()=>{
  proyectosContainer.classList.toggle('visible')
  icon.classList.toggle('visible')
})
