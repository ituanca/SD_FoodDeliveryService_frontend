import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import {Link, Outlet} from "react-router-dom";
import {Button} from "react-bootstrap";
import {Col} from "reactstrap";
import axios from "axios";


function SignUpCustomer(){
    const [errorMessagesSC, setErrorMessagesSC] = useState({});
    const [isSubmittedSC, setIsSubmittedSC] = useState(false);
    const [customerRegistration, setCustomerRegistration] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
    });

    const errors = {
        username: "username already exists",
        email: "email already exists",
        invalid_email: "invalid email"
    };

    const handleInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setCustomerRegistration({ ...customerRegistration, [name] : value});
    }

    const handleSubmit = (event) => {
        // Prevent page reload
        event.preventDefault();

        axios
            .post('http://localhost:8080/assignment2/customer/createAndValidate', customerRegistration)
            .then((response) => {
                console.info(response);
                if (response.data === "username_exists") {
                    setErrorMessagesSC({name: "username", message: errors.username});
                    localStorage.removeItem("customer");
                } else if (response.data === "email_exists"){
                    setErrorMessagesSC({name: "email", message: errors.email});
                    localStorage.removeItem("customer");
                }  else if (response.data === "invalid_email"){
                    setErrorMessagesSC({name: "invalid_email", message: errors.invalid_email});
                    localStorage.removeItem("customer");
                } else{
                    setIsSubmittedSC(true);
                    localStorage.setItem("customer", JSON.stringify(customerRegistration));
                }
            })
            .catch((error) => {
                console.error("There was an error!", error.response.data.message)
            });
    };

    const renderErrorMessage = (nameErr) =>
        nameErr === errorMessagesSC.name && (
            <div className="error">{errorMessagesSC.message}</div>
        );

    const renderForm = (
        <div className="form">
            <form onSubmit = {handleSubmit}>
                <div className="input-container">
                    <label>Name </label>
                    <input type="text"
                           value={customerRegistration.name}
                           onChange={handleInput}
                           name="name" required id = "name"/>
                </div>
                <div className="input-container">
                    <label>Email </label>
                    <input type="text"
                           value={customerRegistration.email}
                           onChange={handleInput}
                           name="email" required id = "email"/>
                    {renderErrorMessage("email")}
                    {renderErrorMessage("invalid_email")}
                </div>
                <div className="input-container">
                    <label>Username </label>
                    <input type="text"
                           value={customerRegistration.username}
                           onChange={handleInput}
                           name="username" required id = "username"/>
                    {renderErrorMessage("username")}
                </div>
                <div className="input-container">
                    <label>Password </label>
                    <input type="password"
                           value={customerRegistration.password}
                           onChange={handleInput}
                           name="password" required id = "password"/>
                </div>
                <div className="button-container">
                    <input type="submit"/>
                </div>
                <div>
                    <span>&nbsp;&nbsp;</span>
                    <Link to="/">
                        <Button as={Col} variant="outline-dark">Go back</Button>
                    </Link>
                </div>
            </form>
        </div>
    );

    return (
        <div className="app">
            <div className="login-form" style={{backgroundColor: 'lightgreen',}}>
                <div className="title">Sign Up</div>
                {isSubmittedSC ?
                    <div>
                        <div>
                            Account created successfully
                        </div>
                        <span>&nbsp;&nbsp;</span>
                        <Link to="/CustomerActions">
                            <span>&nbsp;&nbsp;</span>
                            <Button as={Col} variant="success">Go to customer page</Button>
                        </Link>
                    </div>
                    : renderForm}
                <Outlet />
            </div>
        </div>
    );
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<LogInCustomer />, rootElement);
export default SignUpCustomer;