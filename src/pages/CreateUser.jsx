import React, {Component} from 'react';
import '../css/main.css';
import '../css/create_user.css';
import apiClient from '../services/api';
import {Redirect} from 'react-router-dom';
import {callOnLoginCallbacks} from '../utils';

class CreateUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            f_name: "",
            l_name: "",
            password: "",
            conf_password: "",
            role: "",
            adress: "",
            housenumber: "",
            postalcode: "",
            error_mesage: ""
        }
    }

    register_webtoken(event) {
        event.preventDefault(); //voorkomt dat de pagina refreshed
        const emailJH = this
            .state
            .email
            .split("@"); // check of email van JH is
        const special_char = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/); //special chars

        if (emailJH[1] !== "jungheinrich.nl") {
            this.setState({error_mesage: "Gebruik een Jungheinrich email"});
            return;
        } else if (this.state.password !== this.state.conf_password) { //check of wachtwoorden overeen komen
            this.setState({error_mesage: "Wachtwoorden komen niet overeen"});
            return;
        } else if (this.state.password.length < 6 || special_char.test(this.state.password)) {
            this.setState({
                error_mesage: "Een wachtwoord moet minimaal 6 letters lang zijn en een speciaal teken bevatte" +
                        "n"
            });
        } else {
            this.setState({error_mesage: null});
        }
        apiClient
            .post("/api/register", { //stuurt een register request naar de API
                email: this.state.email,
                name: this.state.f_name + " " + this.state.l_name,
                password: this.state.password,
                adress: this.state.adress,
                housenumber: this.state.housenumber,
                postalcode: this.state.postalcode,
                role: this.state.role
            })
            .then(
                response => { //Op het moment is er een CSRF token mismatch error dit is een safety iets van laravel maar dit betekent wel dat de req bij de API binnekomt
                    this.setState({token: response.data});
                    apiClient
                        .post("/api/login", { //stuurt een post request naar de API
                            email: this.state.email, //De eerste email moet overeen komen met de naam in de db. De tweede email is van de states dus de daat werkelijke waarde
                            password: this.state.password
                        } //password het zelfde verhaal als email)
                        .then(response => {
                            this.setState({loggedIn: true, token: response.data, loading: false});
                        }))
                }
            );
    }

    render() {
        if (this.state.loggedIn === true) {
            console.log(this.state.token.token);
            window
                .localStorage
                .setItem('token', this.state.token.token);
            // Gets update when a user is logged.

            window
                .localStorage
                .setItem('login', true);
            apiClient.defaults.headers.Authorization = "Bearer " + this.state.token.token;

            apiClient
                .get("/api/user")
                .then((response) => {
                    console.log(response.data.role);
                    localStorage.setItem("role", response.data.role);
                    localStorage.setItem("userId", response.data.id);
                    callOnLoginCallbacks();

                })
                .catch(function (error) {
                    console.log("er gaat iets fouts", error)

                });
            callOnLoginCallbacks();
            return (<Redirect to="/products"/>)
        }

        return (
            <main className="create_user">
                <form
                    className="create_user__form"
                    onSubmit={event => this.register_webtoken(event)}>
                    <div className="create_user__header">
                        <h1>Registreren</h1>
                    </div>
                    <div className="create_user__form__group">
                        <label>Voornaam:</label>
                        <input
                            className="create_user__form__input"
                            type="text"
                            placeholder="Voornaam"
                            required="required"
                            value={this.state.f_name}
                            onChange={(e) => this.setState({f_name: e.target.value})}/>
                    </div>
                    <div className="create_user__form__group">
                        <label>Achternaam:</label>
                        <input
                            className="create_user__form__input"
                            type="text"
                            placeholder="Achternaam"
                            required="required"
                            value={this.state.l_name}
                            onChange={(e) => this.setState({l_name: e.target.value})}/>
                    </div>
                    <div className="create_user__form__group">
                        <label>Email:
                        </label>
                        <input
                            className="create_user__form__input"
                            type="email"
                            placeholder="Werkmail"
                            required="required"
                            value={this.state.email}
                            onChange={(e) => this.setState({email: e.target.value})}/>
                    </div>
                    <div className="create_user__form__group">
                        <label>Wachtwoord:
                        </label>
                        <input
                            className="create_user__form__input"
                            type="password"
                            placeholder="Wachtwoord"
                            required="required"
                            value={this.state.password}
                            onChange={(e) => this.setState({password: e.target.value})}/>
                    </div>
                    <div className="create_user__form__group">
                        <label>Herhaal wachtwoord:
                        </label>
                        <input
                            className="create_user__form__input"
                            type="password"
                            placeholder="Wachtwoord"
                            required="required"
                            value={this.state.conf_password}
                            onChange={(e) => this.setState({conf_password: e.target.value})}/>
                    </div>
                    <div className="create_user__form__group">
                        <label>Adres:
                        </label>
                        <input
                            className="create_user__form__input"
                            type="Adress"
                            placeholder="Voorbeeldstraat"
                            required="required"
                            value={this.state.adress}
                            onChange={(e) => this.setState({adress: e.target.value})}/>
                    </div>
                    <div className="create_user__form__group">
                        <label>Huisnummer:
                        </label>
                        <input
                            className="create_user__form__input"
                            type="text"
                            placeholder="1a"
                            required="required"
                            value={this.state.house_number}
                            onChange={(e) => this.setState({housenumber: e.target.value})}/>
                    </div>
                    <div className="create_user__form__group">
                        <label>Postcode:
                        </label>
                        <input
                            className="create_user__form__input"
                            type="postalcode"
                            placeholder="1234AB"
                            required="required"
                            value={this.state.postalcode}
                            onChange={(e) => this.setState({postalcode: e.target.value})}/>
                    </div>
                    <div className="create_user__form__group">
                        <label>Kies rol:
                        </label>
                        <input
                            className="create_user__form__input"
                            list="user_role"
                            placeholder="Rol"
                            value={this.state.role}
                            onChange={(e) => this.setState({role: e.target.value})}/>
                        <datalist id="user_role">
                            <option value="Manager"/>
                            <option value="Medewerker"/>
                        </datalist>
                    </div>
                    <input className="create_user__form__button" type="submit"/>
                    <p id="create_user__form__notes">{this.state.error_mesage}</p>
                    <a href="/login">
                    <input
                        className="create_user__form__login__button"                    
                        value="Heb je al een account? Inloggen"
                        {...(this.state.loading ? {disabled: "disabled"} : {})}
                        />  
                        </a>                  
                </form>
            </main>
        );
    }
}

export default CreateUser;
