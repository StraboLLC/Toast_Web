class SessionController < ApplicationController
	def create
		user = User.authenticate(params[:email],md5(params[:password]))
		if user
			session[:user_id] = user.id
			redirect_to root_url, :notice => "Logged in!"
		else
			redirect_to login_url
		end
	end

	def destroy
		session[:user_id] = nil
		redirect_to login_url, :notice => "Logged out!"
	end

end
