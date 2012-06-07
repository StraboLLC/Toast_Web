# Controls all of the albums that a user uploads.
class AlbumsController < ApplicationController
	# Show a user's albums.
	def index
		if(session[:user_id])
			@user = User.find_by_id(session[:user_id] )
			@albums = Album.find_by_user_id(session[:user_id])
			render "index"
		else 
			redirect_to login_url
		end
	end
	# Create a new Album
	def new
		if(session[:user_id])
			@album = Album.new
		else
			redirect_to login_url
		end

	end
end
