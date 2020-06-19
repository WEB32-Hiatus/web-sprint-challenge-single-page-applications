import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import axios from 'axios';

const formSchema = yup.object().shape({
    name: yup.string().required('Name is a required field')
});

export default function Form() {

    const [formState, setFormState] = useState({
        name: '',
        size: '',
        toppings: '',
        instructions: ''
    });

    const [error, setError] = useState({
        name: ''
    });

    const [buttonDisabled, setButtonDisabled] = useState(true);

    const [orders, setOrders] = useState([]);

    useEffect( () => {

        formSchema.isValid(formState).then( (valid) => {
            setButtonDisabled(!valid);
        });
    }, [formState]);

    const validateChange = (event) => {
        yup
        .reach(formSchema, event.target.name)
        .validate(event.target.value)
        .then( (valid) => {
            setError({
                ...error, 
                [event.target.name]: ''
            });
        })
        .catch( (err) => {
            setError({
                ...error,
                [event.target.name]: err.error[0]
            });
        });
    };

    const formSubmit = (event) => {
        event.preventDefault();
        axios.post('https://reqres.in/', formState).then( (response) => {
            setOrders([...orders, response.data.name]);
            console.log('success', orders);

            setFormState({
                name: '',
                size: '',
                toppings: '',
                instructions: ''
            });
        })
        .catch( (err) => {
            console.log(err.response);
        });
    };

    const inputChange = (event) => {
        event.persist();

        const newFormData = {
            ...formState, 
            [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
        };
        validateChange(event);
        setFormState(newFormData)
    };

    return (
        <form onSubmit={formSubmit}>
            <label htmlFor='name'>
                Name
                <input id='name' type='text' name='name' value={formState.name} onChange={inputChange}/>
                {error.name.length > 2 ? <p className='error'>{error.name}</p> : null}
            </label>
            <label htmlFor='size'>
                Size
                <select id='size' type='text' name='size' value={formState.size} onChange={inputChange}>
                <option value=''>Select an option</option>
                <option value='Small'>Small</option>
                <option value='Medium'>Medium</option>
                <option value='Large'>Large</option>
                <option value='X-Large'>X-Large</option>
                </select>
            </label>
        </form>
    );
};