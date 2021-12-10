# E-CLASS (Microsoft Engage'21)

## Problem Statement

 Build a functional prototype of a platform that gives students an array of digital academic and social tools to stay engaged with their studies, peers and broader university community during pandemic.

### Agile Methodology and Approach to Build the Project
I have followed Agile Scrum Methodology to build this project.
Agile Scrum Methodology is a project management method that is best used to improve the project in every iteration. Each iteration has sprints, where the goal in each sprint is to build the most important feature first and then improve the project as a potentially deliverable product.

Microsoft has provided us with sprints: Learn, Design, Build, Submit. 
I also used a scrum board on trello to track my progress during ongoing sprints.

I divided my project in three sprints of one week each. They are:

### Sprint 1
* Idea Brainstorming and finalization, R&D on the selected idea.
* Project setup with React(frontend), Node.j-Express(backend), and Firebase(database).
* Landing Page, Home Page and basic styling.
* SignUp, SignIn and Otp modals.

### Sprint 2
* Join and create classes.
* Modals for actions(Error, Information, Success).
* Unique class code generator while making a class for joining a class as a student.
* Dynamic Class cards after creating and joining a class.
* Class View - Dashboard, Scheduler, People ,and Request/Register.
* Scheduler - Calendar, class schedule, updating, and deletion by the teacher.
* Nodemailer functionality for sending emails while signing Up, scheduling classes, and updates.


### Sprint 3
* Class Dashboard
* Announcements section and make a query section.
* Color codes for chat section in dashboard for teacher and students.
* Register for an offline lecture seat in joined class.
* Student’s request verification, approval and decline by teacher.
* Unregister from an offline lecture.
* Mail notifications for seat availability, Request approval and Request Decline.
##
## Getting Started

This project is made using React, Node and Express. Kindly follow the below mentioned instructions to run it on your machine.

### Pre-requisites

You need to install [Node.js](https://nodejs.org/en/) to run this project on your local machine. [Node.js](https://nodejs.org/en/) is a completely free, asynchronous event-driven JavaScript runtime.

	
### Setup
* Git Clone the Repo or download the Project Zip file.
* Extract the files on your system. Lets assume you extracted in D drive.\
Then your path to the project file will be,

```
D:\E-class
```
* Open the folder of the E-Class in your drive, you will see some subfolders and files in it. From there open two folders named as "api" and "client" via vs code seperately in different vs code windows. \
Your path to the project files for api and client will be ,

```
D:\E-class\api
D:\E-class\client
```

* To run this project, install it locally using npm and run these commands in the vs code terminal for both api and client. 

```
$ npm install
$ npm start
```

* Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
##
## Technologies
This is Web Development Project build using React(JavaScript library) and Express(Node.js framework).\
Project is created with:

* React version: ^17.0.2
* Express version: ~4.16.1
* DevExtreme version: ^2.7.6
* Node.js
* HTML
* CSS
* JavaScript
* Firebase (Database)
##

## Features
The project provides standardized features for an online classroom. Below are some of the key features :

* SignUp to application only after submitting OTP over registered email Id.
* SignIn & Working Panel for students and teachers combined.
* Quick and easy class creation and join using an auto-generated classcode.
* Dynamic Class Cards for every joined and created class.
* Class DashBoard to exchange information, make announcements and discuss subject with teacher and students.
* Color codes for students and teacher in class discussion chat.
* Easy lecture scheduling by teacher via scheduler.
* Email notifications to all the enrolled students for any event scheduled by teacher thrugh E-Class.
* Personel Roaster for students to view scheduled lectures and events.
* Interface to know the Teacher and Enrolled students in class.
* Register feature for students to request for an offline lecture Seat(Limited seats decided by teacher while creating class).
* [CoWIN-Share vaccination status](https://cdn-api.co-vin.in/api/v3/vaccination/status/knowYourStatus) API to generate [Share your status](https://api.cowin.gov.in/api/v3/vaccination/status/90827175351220/3) link and submit it to request for an offline seat.
* Requests feature for teachers to verify the vaccination certificate and approve or decline a request.
* Clean and easy to navigate UI.

