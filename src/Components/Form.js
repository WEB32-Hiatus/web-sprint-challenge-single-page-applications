import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import axios from 'axios';

const formSchema = yup.object().shape({
    name: yup
    .string()
    .required('Name is a required field'),
    size: yup
    .string()
    .oneOf(['small', 'medium', 'large', 'x-Large'], 'Please select a size'),
    instructions: yup
    .string()
});

const initialFormValues = {
    name: '', 
    size: '', 
    toppings: {
        pepperoni: false, cheese: false, mushrooms: false, olives: false
    },
    instructions: ''
};

export default function Form() {

    const [formState, setFormState] = useState(initialFormValues)

    const [error, setError] = useState({
        name: '', 
        size: ''
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
                [event.target.name]: err.error
            });
        });
    };

    const formSubmit = (event) => {
        event.preventDefault();
        axios
        .post('https://reqres.in/', formState)
        .then( (response) => {
            setOrders([...orders, response.data]);
            console.log('success', orders);

            setFormState({
                name: '',
                size: '',
                toppings: {
                    pepperoni: '', cheese: '', mushrooms: '', olives: ''
                },
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
            [event.target.name]: 
                event.target.type === 'checkbox' ? event.target.checked : event.target.value
        };
        validateChange(event);
        setFormState(newFormData)
    };

    const onCheckboxChange = (event) => {
        const { name, checked } = event.target
        setFormState({
            ...formState, 
            toppings: {
                ...formState.toppings, 
                [name]: checked
            }
        });
    };

    return (
        <form onSubmit={formSubmit}>
            <div className='Name'>
                <label htmlFor='name'>
                    <h3>Full Name</h3>
                    <input type='text' name='name' value={formState.name} onChange={inputChange}/>
                    {error.name.length > 0 ? <p className='error'>{error.name}</p> : null}
                </label>
            </div>
            <br/>
            <div className='Size'>
                <label htmlFor='size'>
                    <h3>Size</h3>
                    <select name='size' value={formState.size} onChange={inputChange}>
                    <option value=''>Select an option</option>
                    <option value='small'>Small</option>
                    <option value='medium'>Medium</option>
                    <option value='large'>Large</option>
                    <option value='x-Large'>X-Large</option>
                    </select>
                </label>
            </div>
            <br/>
            <div className='Toppings'>
                <label htmlFor='toppings'>
                    <h3>Toppings:</h3>
                    Pepperoni
                    <input type='checkbox' name='pepperoni' checked={formState.pepperoni} onChange={onCheckboxChange}/>
                    <br/>
                    Cheese
                    <input type='checkbox' name='cheese' checked={formState.cheese} onChange={onCheckboxChange}/>
                    <br/>
                    Mushrooms
                    <input type='checkbox' name='mushrooms' checked={formState.mushrooms} onChange={onCheckboxChange}/>
                    <br/>
                    Olives
                    <input type='checkbox' name='olives' checked={formState.olives} onChange={onCheckboxChange}/>
                </label>
            </div>
            <br/>
            <div className='Instructions'>
                <label htmlFor='instructions'>
                    <h3>Special Instructions</h3>
                    <input type='text' name='instructions' value={formState.instructions} onChange={inputChange}/>
                </label>
            </div>
            <br/>
            <button disabled={buttonDisabled}>Submit</button>
            <pre>{JSON.stringify(orders, null, 2)}</pre>
        </form>
    );
};