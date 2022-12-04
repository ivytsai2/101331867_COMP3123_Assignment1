const express = require('express');
const EmployeeModel = require('../models/Employees');
const fun = require('../functions');
const employeeRoutes = express.Router();
const auth = require("../middleware/auth");

//get all employee list
employeeRoutes.get('/employees', auth, async (req, res) => {
    try {
        const employees = await EmployeeModel.find();
        res.status(200).send(employees);
    } catch (e) {
        res.status(500).send({
            status: false,
            message: e.message
        });
    }
})

/*{
    "first_name": "fname1",
    "last_name": "lname1",
    "email": "emial@domain.com",
    "gender": "male",
    "salary": 500.59
}*/
//add new employee
employeeRoutes.post('/employees', auth, async (req, res) => {
    const {first_name, last_name, email, salary} = req.body;
    // validate user input
    if (fun.isEmpty(req.body)) {
        return res.status(400).send(fun.emptyContentMsg("employee"))
    }
    try {
        const newEmployee = new EmployeeModel(req.body);
        await newEmployee.save();
        res.status(201).send({
            status: true,
            message: "Employee added successfully!"
        });
    } catch (e) {
        const duplicate = e.code === 11000;
        if (!(first_name && last_name && email && salary)){
            return res.status(400).send({
                status: false,
                message: "Fields first name, last name, email and salary are required"
            });
        } else if(duplicate) {
            return res.status(400).send({
                status: false,
                message: "This email is already in used"
            });
        }
        res.status(500).send({
            status: false,
            message: e.message
        });
    }
})

//display employee details
employeeRoutes.get('/employees/:eid', auth, async (req, res) => {
    const id = req.params.eid;
    try {
        const employee = await EmployeeModel.findById(id);
        res.status(200).send(employee);
    } catch (e) {
        res.status(500).send({
            status: false,
            message: `Cannot find employee Id ${id}`
        });
    }
})

//update employee details
employeeRoutes.put('/employees/:eid', auth, async (req, res) => {
    const {first_name, last_name, email, gender, salary} = req.body;
    const id = req.params.eid;
    // validate user input
    if (fun.isEmpty(req.body)) {
        return res.status(400).send(fun.emptyContentMsg("employee"))
    }
    try {
        const employee = await EmployeeModel.findById(id);
        if(!employee) {
            let error = new Error(`Employee Id ${id} not found`);
            error.name = "EmployeeIdError";
            throw error;
        }
        if (fun.ifExistButEmpty(first_name)) {
            let error = new Error("First name can not be empty");
            error.name = "FirstNameError";
            throw error;
        }
        if (fun.ifExistButEmpty(last_name)) {
            let error = new Error("Last name can not be empty");
            error.name = "LastNameError";
            throw error;
        }
        if (fun.ifExistButEmpty(salary)) {
            let error = new Error("Salary can not be empty");
            error.name = "SalaryError";
            throw error;
        }
        if (gender !== undefined && gender.toLowerCase() != "male" && gender.toLowerCase() != "female" && 
            gender.toLowerCase() != "other") {
                let error = new Error("Gender can only be male, female or other.");
                error.name = "GenderError";
                throw error;
        } 
        await EmployeeModel.findByIdAndUpdate(id, req.body);
        res.status(200).send({
            status: true,
            message: `Employee Id ${id} is updated`
        });
    } catch (e) {
        res.status(500).send({
            status: false,
            message: e.message
        });
    }
})

//delete employee
employeeRoutes.delete('/employees', auth, async (req, res) => {
    try {
        const id = req.query.eid;
        const deletedEmployee = await EmployeeModel.findByIdAndDelete(id);
        if (deletedEmployee) {
            //204 no content
            res.status(204).send();
        } 
        else {
            res.status(500).send({
                status: false,
                message: `Employee Id ${id} not found`
            });
        }
    } catch (e) {
        res.status(500).send({
            status: false,
            message: e.message
        });
    }
})

module.exports = employeeRoutes