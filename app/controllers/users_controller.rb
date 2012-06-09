class UsersController < ApplicationController
	# Shows a user's home page
	def index
		if session[:user_id]
			@user = User.find_by_id(session[:user_id] )
			@albums = Album.where("user_id" => session[:user_id]) 
			@top_string = @user.first_name.capitalize+"'s Albums"
			@albums ||= Array.new
		else 
			redirect_to root_path
		end
	end
	# Shows a the Login View
	def login
		if session[:user_id]
			redirect_to profile_path
		else 

		end
	end
	# Shows the register page
	def register
		@user = User.new

		respond_to do |format|
			format.html
			format.json { render json: @user }

		end
	end
	def account
		if session[:user_id]
			@user = User.find_by_id(session[:user_id] )
			@top_string = "Edit your Account Information"
		else 
			redirect_to root_path
		end
	end
	# Inserts a new user into the database
	def create
		@user = User.new(params[:user])

		respond_to do |format|
		  if @user.save

		  else
		    format.html { render action: "new" }
		    format.json { render json: @user.errors, status: :unprocessable_entity }
		  end
		end
	end
	# Updates a user's attributes in the database.
	def update
		@user = User.find(session[:user_id])
		if @user.update_attributes(params[:user])
			redirect_to profile_path, notice: 'User was successfully updated.'
		else
			render action: "account"
		end
		

	end
end
