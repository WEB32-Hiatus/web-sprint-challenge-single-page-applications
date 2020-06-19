import React, { useState, useEffect } from 'react';
import * as yup from 'yup';

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

}