class HomeController < ApplicationController
	def index
		if session[:user_id]
			redirect_to profile_path
		else

		end
	end
	def about
			

	end
end
