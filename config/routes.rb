Toast::Application.routes.draw do



  # User Routes

  # User's Home Page
  match "/me" => "users#index", :as => :profile
  # Creates a User
  post "/u" => "users#create"
  put "/update" => "users#update", :as => :update_user
  # Shows the form to register a user
  match "/register" => "users#register", :as => :register_user
  # Shows the form to login
  match "/login" => "users#login", :as => :login_user
  # Shows the form to edit a user's account
  match "/account" => "users#account", :as => :account

  # Album Routes
  get "player/index"
  get "albums/index"
  match "/album/:album_token" => "albums#show", :as => :album
  post "/a" => "albums#create"
  match '/albums/new' => 'albums#new', :as => :new_album

  # Session Routes
  match "session/create", :as => :session
  match "logout" => "session#destroy", :as => :logout

  # Other Routes
  match "/about" => "home#about"
  match "register" => "users#register"
  match "login" => "users#login"

  # Routes
  get "/privacy" => "home#privacy", :as => :privacy
  get "/users" => redirect('/')
  root :to => "home#index"

end
