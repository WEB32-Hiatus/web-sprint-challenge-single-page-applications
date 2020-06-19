import React from 'react';
import { Link } from 'react-router-dom'

export default function Home() {

    return (
        <div className='Home'>
            <Link to = '/form'>
                <button>Place Order</button>
            </Link>
        </div>
    )
}


