import React, { Component } from 'react'
import {reduxForm, Field} from 'redux-form'
import emailValidator from 'email-validator'
import ErrorField from '../common/ErrorField'

class AddPeopleForm extends Component {
    render() {
        const {handleSubmit} = this.props
        return (
            <div>
                <h2>Add People</h2>
                <form onSubmit={handleSubmit}>
                    <Field name="firstName" component={ErrorField}/>
                    <Field name="lastName" component={ErrorField}/>
                    <Field name="email" component={ErrorField}/>
                    <div>
                        <input type='submit'/>
                    </div>

                </form>
            </div>
        )
    }
}

const validate = ({firstName, lastName, email}) => {
    const errors = {}

    if(!email) errors.email = 'email is required'
    else if (!emailValidator.validate(email)) errors.email = 'invalid email'

    if(!firstName) errors.firstName = 'First Name is require'
    else if(firstName.length < 4) errors.firstName = 'to short'

    if(!lastName) errors.lastName = 'Last Name is require'
    else if(lastName.length < 4) errors.lastName = 'to short'

    return errors
}

export default reduxForm({
    form:'people',
    validate
})(AddPeopleForm)