import React from 'react';
import { createInstance, getInstances } from '../common/api';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


export default function ModelForm () {

    const [userInput, setUserInput] = useState(
        {
            name: '',
            pictureUrl: '',
            manufacturer_id: '',
        }
    );

    const [loadData, setLoadData] = useState(
        {
            manufacturers: [],
        }
    );

    const [noData, setNoData] = useState([]);

    useEffect(() => {
        const fetchInstances = async () => {

            try {

                const manufacturers = await getInstances(8100, 'manufacturers');
                setLoadData({
                    ...loadData, manufacturers:manufacturers
                });

            } catch (e) {
                console.error(e);
            }
        }
        fetchInstances();
    }, []);

    const handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        setUserInput({
            ...userInput, [name]:value
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {...userInput};
        data.picture_url = data.pictureUrl;
        delete data.pictureUrl;

        let response = await createInstance(8100, 'models', data);

        if (response.ok) {

            const cleared = {
                name: '',
                pictureUrl: '',
                manufacturer_id: '',
            };
            setUserInput(cleared);
            setNoData(false);
        }
    }
      // refreshPage();  // how to change the timing?

    if (noData.length > 0) {
        return (
        <div className="container">
            <div className="row">
                <div className="offset-3 col-6">
                    <div className="shadow p-4 mt-4">
                        <h1>Uh oh...</h1>
                        <p>You're missing{' '}
                            {noData.map(i => {
                                return (
                                <Link key={i} to={`/${i}/new`}>{i}</Link>
                                )
                            }
                            )}
                        {' '}data!</p>
                    </div>
                </div>
            </div>
        </div>
        )
    } else {
        return (
            <div className="container">
                <div className="row">
                    <div className="offset-3 col-6">
                        <div className="shadow p-4 mt-4">
                            <h1>Create a model</h1>
                            <form onSubmit={handleSubmit}>
                            <div className="form-floating mb-3">
                                <input onChange={handleChange} placeholder="Name" value={userInput.name} required type="text" id="name" name="name" className="form-control"/>
                                <label htmlFor="name">Name</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input onChange={handleChange} placeholder="Picture URL" value={userInput.pictureUrl} required type="text" id="pictureUrl" name="pictureUrl" className="form-control"/>
                                <label htmlFor="pictureUrl">Picture URL</label>
                            </div>
                            <div className="mb-3">
                                <select onChange={handleChange} value={userInput.manufacturer_id} required id="manufacturer_id" name="manufacturer_id" className="form-select">
                                    <option value="">Choose a manufacturer</option>
                                    {loadData.manufacturers.map(manufacturer => {
                                        return (
                                            <option key={manufacturer.id} value={manufacturer.id}>
                                                {manufacturer.name}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                            <button className="btn btn-primary">Create</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
