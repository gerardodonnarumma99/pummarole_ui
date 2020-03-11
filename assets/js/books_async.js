const BOOKS_API = 'http://127.0.0.1:8000/api/v1'


class Book{
    constructor()
    {
        this.addNewBook=document.getElementById('addNewBook')
        this.title=document.getElementById('bookTitle');
        this.price=document.getElementById('bookPrice');
        this.createBook=document.getElementById('createBook');
        this.bodyTable=document.getElementById('bodyTable');
        this.btnAlert=document.getElementById('btnAlert');
        //Update
        this.updateBook=document.getElementById('updateBook');
        this.idUpdate=document.getElementById('idUpdate');
        this.titleUpdate=document.getElementById('bookTitleUpdate');
        this.priceUpdate=document.getElementById('bookPriceUpdate');

        this.initListeners();

        this.loadBook();
  }

  /**
   * Inizializza gli eventi installando gli ascoltatori
   */
  initListeners () {
    this.submit=this.submit.bind(this);
    this.createBook.addEventListener('click',this.submit);

    this.handleNewBook=this.handleNewBook.bind(this);
    this.addNewBook.addEventListener('click',this.handleNewBook);

    //Delete
    this.deleteBook = this.deleteBook.bind(this);
    $(document).delegate(".deleteBook", "click", this.deleteBook);

    //Update
    this.submitUpdate=this.submitUpdate.bind(this);
    this.updateBook.addEventListener('click',this.submitUpdate);
    this.handleUpdateBook = this.handleUpdateBook.bind(this);
    $(document).delegate(".updateBook", "click", this.handleUpdateBook);
  }

  /**
   * Resetta il form
   */
  resetForm () {
    this.title.value='';
    this.price.value='';
  }

  /**
   * Apre la modale per creare il libro
   * @param {Evento} e
   */
  handleNewBook (e) {
    e.preventDefault();
    this.resetForm();
    $("#bookModal").modal();
  }

  /**
   * Apre la modale per modificare il libro
   * @param {Evento} e
   */
  handleUpdateBook (e) {
    e.preventDefault();
    let idBook=$(e.currentTarget).data("id");
    this.resetForm();
    this.idUpdate.value=idBook;
    $("#bookModalUpdate").modal();
  }

  async loadBook(){
      try{
        const result=await axios.get(`${BOOKS_API}/books`);
        const books=result.data;
        let bookList='';
        for (const book of books) {
            bookList+="<tr><td><a href='#' class='btn btn-danger btn-sm deleteBook' id='deleteBook' data-id="+book.id+">Elimina</a></td><td><a href='#' class='btn btn-primary btn-sm updateBook' id='updateBook' data-id="+book.id+">Modifica</a></td><td>"+book.title+"</td><td>"+new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(book.price)+"</td></tr>";
          }
          this.bodyTable.innerHTML=bookList;
      }
      catch(err)
      {
          console.log(err);
      }
  }

  async submit()
  {
    this.form=document.getElementById('formCreate');
    if(!this.form.checkValidity())
    {
      alert("Input del form non validi!");
      this.resetForm();
      return;
    }

    try{
        //Richiesta post
        const result=await axios.post(BOOKS_API+'/books', {
        title: this.title.value,
        price: parseFloat(this.price.value)
      });
      if(result.status===200)
      {
        this.loadBook();
        $("#bookModal").modal('hide');
        this.alertSuccess("Libro aggiunto!");
      }
    }catch(err){
        console.log(err);
    }
  }

  async submitUpdate(){
    this.form=document.getElementById('formUpdate');
    if(!this.form.checkValidity())
    {
      alert("Input del form non validi!");
      this.resetForm();
      return;
    }
    try{
        //Richiesta put
        await axios.put(BOOKS_API+'/books/'+this.idUpdate.value, {
        title: this.titleUpdate.value,
        price: parseFloat(this.priceUpdate.value)
      })
    }catch(err){
        console.log(err);
    }
  }

  async deleteBook(evt){
    let idBook=$(evt.currentTarget).data("id");
    let btnConfirm=confirm("Sei sicuro di voler eliminare il libro?");
    if(btnConfirm==true)
    {
        try{
            //Elimino il libro
            await axios.delete(`${BOOKS_API}/books/${idBook}`);
            this.alertSuccess("Libro eliminato!");
            this.loadBook();
        }catch(err)
        {
            console.log(err);
        }
    }
  }

  /**
   * 
   * @param {Messaggio da far comparire nell'alert} msg
   */
  alertSuccess(msg)
  {
    this.btnAlert.innerHTML=msg;
    this.btnAlert.style.display="block";
    //transition-delay:2s;transition-property: opacity; opacity: 0.3;-webkit-transition-property: opacity; /*Safari e Chrome */-webkit-transition-delay: 2s;
    window.setTimeout(function(){btnAlert.style.display="none";},2000);
  }
}

export default new Book()