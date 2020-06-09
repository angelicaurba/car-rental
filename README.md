# Exam #12345: "Exam Title"
## Student: s123456 LASTNAME FIRSTNAME 

## React client application routes

- Route `/catalogue`: is the pages that appears to unathentcated users to browse available vehicles
- Route `/login`: contains the login form in order to authenticate a user
- Route `/user/book`: is the page where an authenticated user can select the parameters of a new rental
- Route `/user/pay`: is the page where the user, after having choose the rental's parameters, pays the service
- Route `/user/rentals`: is the page where a user can see past and future rentals, and eventually delete the future ones


## REST API server

- POST `/login`
  - request parameters and request body content
  - response body content
- GET `/api/vehicles`
  - request parameters: none
  - response body content: an array of objects, each ones containing the vehicle's characteristics
- GET `/api/available`
  - TODO
- POST `/api/rentals`
  - request body content: an object containing all the rental parameters
  - response body content: none
- DELETE `api/rentals/:rentalId`
  - reqest parameter `rentalId` is the id of the rental in the database
  - response body content: none

## Server database

- Table `users` :
  | UserId | Name | Surname | Username | Password |
  | --- | --- | --- | --- | --- |
- Table `Vehicles` :
  |VehicleId | Category | Brand | Model |
  | --- | --- | --- | --- |
- Table `Rentals` :
  |RentalId | VehicleId | UserId | DateFrom | DateTo | AgeDriver | OtherDrivers | Kilometers | Insurance | Price |
  | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | 

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Configurator Screenshot](./img/screenshot.jpg)

## Test users

* username, password
* username, password
* username, password (frequent customer)
* username, password
* username, password (frequent customer)
