import React, { Component } from 'react';
import '../css/productsmanagement.css';
import { useParams } from 'react-router';


import axios from 'axios';



class EditProduct extends Component {
    constructor(props) {
		super(props);
        this.state = {
            image: '',
            productname: '',
            description: '',
            category: '',
            brand: '',
            model: '',
            price: '',
            maxorders: '',
            condition: '',
            approval: '1',
            id: '',
        }

       

    


    

    this.changeHandler = e =>
    {
        this.setState({[e.target.name]: e.target.value})
    }

    this.fileHandler = e =>
    {
        this.setState({[e.target.name]: e.target.files[0]})
    }

    const header = {
        headers: {"Accept": "application/json",
        'content-type': 'multipart/form-data'}
        
      };

    console.log(this.props)
    axios
        .get((process.env.REACT_APP_BASE_URL || 'http://127.0.0.1:8000') + '/api/products' + this.props.match.params.id, header)
        .then(response => {
        this.setState(response.data)
        console.log(response)
        })
        .catch(error => {
        console.log(error)
        
    })
    
    this.delete = e =>
    {
        e.preventDefault();
        axios
        .delete((process.env.REACT_APP_BASE_URL || 'http://127.0.0.1:8000') + '/api/management/products/'+ this.state.id, header)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
        console.log(error)
    })
    }



this.submitHandler = e =>
{
    e.preventDefault()
    let Formdata = new FormData();
    Formdata.append('image',this.state.image
    );
    

    let keys = Object.keys(this.state);
    for(let i = 0 ; i<keys.length; i++)
    {
        Formdata.append(keys[i], this.state[keys[i]]);
    }

    
    



    console.log(Formdata)
    const header = {
        headers: {"Accept": "application/json",
        'content-type': 'multipart/form-data'}
        
      };
    axios
        .put('http://localhost:8000/api/management/products' , this.state)
        .then(response => {
        console.log(response)
        })
        .catch(error => {
        console.log(error)
        
    })
};
    
}

	

render() {
    const { image, productname, description, category, brand, model, price, maxorders, condition, approval, id} = this.state
    return (
        <section class="add">
            <h1 class="add__title"> Product wijzigen </h1>
        <form class="create-form" action="/management/products" method="PUT" enctype="multipart/form-data" onSubmit={this.submitHandler}>
            

            <label for="name">Titel</label>
            <input class="create-form__input" name="productname" type="text" value={productname} onChange={this.changeHandler}/>
            <label for="kind">Categorie</label>
            <input class="create-form__input" name="category" id="category" type="text" value={category} onChange={this.changeHandler}/>
            <label for="kind">Merk</label>
            <input class="create-form__input" name="brand" id="brand" type="text" value={brand} onChange={this.changeHandler}/>
            <label for="kind">Model</label>
            <input class="create-form__input" name="model" id="model" type="text" value={model} onChange={this.changeHandler}/>

                

            <label for="description">Beschrijving</label>
            <textarea class="create-form__input create-form__input--height" name="description" id="description" value={description} onChange={this.changeHandler}> </textarea>

            <label for="prijs">Prijs</label>
            <input class="create-form__input" name="price" type="number" value={price} onChange={this.changeHandler}/>

            <label for="maximum">Maximaal aantal</label>
            <input class="create-form__input" name="maxorders" id="maxorders" type="number" value={maxorders} onChange={this.changeHandler}/>

            <label for="condition">Conditie</label>
            <input class="create-form__input" name="condition"  type="text" value={condition} onChange={this.changeHandler}/>

            <label for="Goedkeuring">Goedkeuring nodig?</label>
            <select id="approval" name="approval" value={approval} onChange={this.changeHandler}>
                <option value="1">Wel nodig</option>
                <option value="0">Niet nodig</option>
            </select>
            
            <div class="create-form__u-flex">
                <a class="create-form__btn" href="/index"><button class="admindelete-form__btn create-form__btn--margin" type="submit" onClick={this.delete}>Verwijderen</button></a>
                <a class="create-form__btn"><button class="adminedit-form__btn" type="submit">Toevoegen</button></a>
            </div>
            



        </form>
        
         </section>

    );
}
}

export default EditProduct;