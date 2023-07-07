import {GithubUser} from './githubuser.js'

//uma classe que vai conter a logica dos dados e guarda-los.

export class Favorites {
  constructor(root){
    this.root = document.querySelector(root)
    this.load()
  }

  load(){
    //parse modifica o JSON para o objeto que esta dentro do JSON
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    
    //this.entries = [{
    //  login:'',
    //  name:'',
    //  public_repos:'',
    //  followers:'',
    // },
    // {
    //  login:'',
    //  name:'',
    //  public_repos:'',
    //  followers:'',
    // }
    //]

   
  }
  save(){
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username){
   try {
    const userExists = this.entries.find(entry => entry.login === username)
    if(userExists){
      throw new Error('Usuário já cadastrado')
    }

    const user = await GithubUser.search(username)

  if(user.login === undefined) {
    throw new Error('Usuário não encontrado!')
  }
  //... = spread
  this.entries = [user, ...this.entries]
  this.update()
  this.save()

 } catch(error){
    alert(error.message)
  }
}

 
  

  delete(user) {
    //Higher-order functions(map, filter, find, reduce)
   const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

   this.entries = filteredEntries
   this.update()
   this.save()
  }
}

//uma classe que vai criar a visualizacao e eventos do HTML. Usar extends para unir as duas classes. Super faz o link do root.
export class FavoritesView extends Favorites {
constructor(root){
super(root)
this.tbody = this.root.querySelector('table tbody')

this.update()
this.onadd()
}


onadd(){
  const addButton = this.root.querySelector
  ('#button')

  addButton.onclick = () => {
    const { value } = this.root.querySelector('.search input')

    this.add(value)
  }
}

update() {
this.removeAllTr()  

this.entries.forEach(user => {
const row = this.createRow()

row.querySelector('.user img').src = `https://github.com/${user.login}.png`
row.querySelector('.user img').alt = `imagem de ${user.name}`
row.querySelector('.user a').href = `https://github.com/${user.login}`
row.querySelector('.user p').textContent = user.name
row.querySelector('.user span').textContent = user.login
row.querySelector('.repositories').textContent = user.public_repos
row.querySelector('.followers').textContent = user.followers

row.querySelector('.action').onclick = ()=>{
const isOk = confirm('Tem certeza que deseja deletar essa linha?')

 if(isOk){
    this.delete(user)
  }
}

this.tbody.append(row)
})


}
 

createRow() {
  const tr = document.createElement('tr')
  tr.innerHTML = `
  
  <td class="user">
    <img src="https://github.com/Thaissu.png" alt="Imagem da pessoa">
    <a href="https://github.com/Thaissu" target="_blank">
      <p>Thaissu Mazaro</p>
      <span>thaissu</span>
    </a>
  </td>
  <td class="repositories">16</td>
  <td class="followers">2</td>
  <td class="action"> remover </td>
   `
   return tr
 }


removeAllTr() {
   this.tbody.querySelectorAll('tr').forEach ((tr) => {
    tr.remove()
  })
}
}