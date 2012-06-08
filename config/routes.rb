Toast::Application.routes.draw do



  # User Routes
  match "/me" => "users#index", :as => :profile
  post "/u" => "users#create"
  get "/u/new" => "users#new", :as => :new_user
  get "/u/:id/edit" => "users#edit", :as => :edit_user
  put "/u/:id" => "users#update", :as => :update_user
  delete "/u/:id" => "users#destroy", :as => :delete_user
  match "/register" => "users#register", :as => :register_user
  match "/login" => "users#login", :as => :login_user
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
  get "/users" => redirect('/')
  root :to => "home#index"

end
