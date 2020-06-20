import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import axios from 'axios';

const formSchema = yup.object().shape({
    name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required(),
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

    const [errors, setErrors] = useState({
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
            setErrors({
                ...errors, 
                [event.target.name]: ''
            });
        })
        .catch( (err) => {
            setErrors({
                ...errors,
                [event.target.name]: err.errors
            });
        });
    };

    const formSubmit = (event) => {
        event.preventDefault();
        axios
        .post('https://reqres.in/api/users', formState)
        .then( (response) => {
            setOrders([...orders, response.data]);
            console.log('success', orders);

            setFormState(initialFormValues);
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
                    {errors.name.length > 0 ? <p className='error'>{errors.name}</p> : null}
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
                    {errors.size ? <p className='error'>{errors.size}</p> : null}
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
            <button disabled={buttonDisabled} name='submit'>Submit</button>
            <pre>{JSON.stringify(orders, null, 2)}</pre>
        </form>
    );
};