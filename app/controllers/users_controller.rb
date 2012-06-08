class UsersController < ApplicationController
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
	def login
		if session[:user_id]
			redirect_to profile_path
		else 

		end
	end
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
	def edit
		@user = User.find(params[:id])
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
		@user = User.find(params[:id])
		respond_to do |format|
			if @user.update_attributes(params[:user])
				format.html { redirect_to @user, notice: 'User was successfully updated.' }
				format.json { head :no_content }
			else
				format.html { render action: "edit" }
				format.json { render json: @user.errors, status: :unprocessable_entity }
			end
		end
	end
	# Removes an album from the database.
	def destroy
		@user = User.find(params[:id])
		@user.destroy

		respond_to do |format|
			format.html { redirect_to users_path }
			format.json { head :no_content }
		end
	end
end
