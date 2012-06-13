Toast::Application.routes.draw do

	# User Routes

	# User's Home Page
	match "/me" => "users#index", :as => :profile
	post "/u" => "users#create"
	put "/update" => "users#update", :as => :update_user
	match "/register" => "users#register", :as => :register_user
	match "/login" => "users#login", :as => :login_user
	match "/account" => "users#account", :as => :account

	# Album Routes

	match "/album/:album_token" => "albums#show", :as => :album

	# Session Routes
	match "session/create", :as => :session
	match "logout" => "session#destroy", :as => :logout

	# Other Routes
	match "/about" => "home#about"
	match "register" => "users#register"
	match "login" => "users#login"

	# Web API
	get "/api/geo_data" => "web_api#geo_data", :as => :api_geo_data

	# Mobile API
	match "/mobile/api/register/" => "mobile_api#register", :as => :mobile_register
	match "/mobile/api/login/" => "mobile_api#login", :as => :mobile_login
	match "/mobile/api/upload/" => "mobile_api#upload", :as => :mobile_upload
	match "/mobile/api/sync/" => "mobile_api#sync", :as => :mobile_sync

	# Encoding Notifications
	post "/notifications/finish/" => "notification#finsh"

	# Routes
	get "/privacy" => "home#privacy", :as => :privacy
	get "/users" => redirect('/')
	root :to => "home#index"

end
