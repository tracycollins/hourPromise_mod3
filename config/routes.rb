Rails.application.routes.draw do

  post "/users/login", to: "users#login"
  
  get "users", to: "users#index"
  get "users/:id", to: "users#show"
  
  get "orgs", to: "orgs#index"
  get "orgs/:id", to: "orgs#show"
  
  get "causes", to: "causes#index"
  get "causes/:id", to: "causes#show"
  
  post "/commitments/create", to: "commitments#create"
  get "commitments", to: "commitments#index"
  get "commitments/:id", to: "commitments#show"
  
  get "payments", to: "payments#index"
  get "payments/:id", to: "payments#show"
end
