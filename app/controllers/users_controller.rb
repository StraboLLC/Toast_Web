class UsersController < ApplicationController
	# Shows a user's home page
	def index
		if session[:user_id]
			@user = User.find_by_id(session[:user_id] )
			@albums = Album.where("user_id" => session[:user_id]) 
			@top_string = @user.name.split(/(\W)/).map(&:capitalize).join+"'s Albums"
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
	##
	# Renders the form for payment.
	def payment


	end
	# Inserts a new user into the database
	def create
		@user = User.new(params[:user])
		@user.password = md5 @user.password 
		if @user.save

		else
			render action: "new"
		end
	end
	# Updates a user's attributes in the database.
	def update
		if session[:user_id]
			@user = User.find(session[:user_id])
			@user.attributes = params[:user]
			@user.password = md5 (@user.password)
			if @user.save
				redirect_to profile_path, notice: 'User was successfully updated.'
			else
				render action: "account"
			end
		end
	end
end
