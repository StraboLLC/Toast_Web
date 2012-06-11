# Controls all of the albums that a user uploads.
class AlbumsController < ApplicationController

	# Shows an album
	def show
		if(session[:user_id])
			@user = User.find_by_id(session[:user_id])
		end
		@album = Album.find_by_album_token(params[:album_token])
		@top_string=@album.name+" by "+@user.name.split(/(\W)/).map(&:capitalize).join



	end

end
