export const baseURL = "http://localhost:8000" 

// export const baseURL = "https://rbc-node-backend.onrender.com"


// Authentication 

export const POST_LOGIN = "/api/auth/login"

export const SEND_RESET_PASSWORD_EMAIL = "/api/auth/request-password-reset"

export const RESET_PASSWORD = "/api/auth/password-reset"


// User Management 

export const REGISTER_USER = "/api/user/"

export const GET_USERS = "/api/user/"

export const UPDATE_USER = "/api/user/"

export const SEND_ACTIVATION_EMAIL = "/api/user/activate-account-request"

export const ACTIVATE_ACCOUNT = "/api/user/activate-account"


//Radiologist interpretations 

export const DELETE_INTERPRETATION = "/api/interpretation"

export const GET_INTERPRETATION = "/api/interpretation/study"

export const POST_INTERPRETATION = "/api/interpretation"

export const PUT_INTERPRETATION = "/api/interpretation"


//Doctor comments management 

export const GET_FEEDBACK_BY_STUDY = "/api/doctor-comments/study"

export const POST_FEEDBACK = "/api/doctor-comments"

export const PUT_FEEDBACK = "/api/doctor-comments"

export const DELETE_FEEDBACK = "/api/doctor-comments"


//AI INTERPRETATION 


export const INTEPRETATION = "/api/interpretation/"
