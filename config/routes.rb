Rails.application.routes.draw do

  post "/users/login", to: "users#login"
  
  get "users", to: "users#index"
  get "users/:id", to: "users#show"
  patch "users/:id", to: "users#update"
  
  get "users/:username/causes", to: "users#causes"
  get "users/:username/commitments", to: "users#commitments"
  get "users/:username/payments", to: "users#payments"
  
  get "orgs", to: "orgs#index"
  get "orgs/:id", to: "orgs#show"
  
  get "causes", to: "causes#index"
  get "causes/:id", to: "causes#show"
  
  post "/commitments/create", to: "commitments#create"
  get "commitments", to: "commitments#index"
  get "commitments/:id", to: "commitments#show"
  
  post "/payments/create", to: "payments#create"
  get "payments", to: "payments#index"
  get "payments/:id", to: "payments#show"

  # SIMULATE TIME PASSAGE:
  post "commitments/testtime", to: "commitments#testtime"
end
