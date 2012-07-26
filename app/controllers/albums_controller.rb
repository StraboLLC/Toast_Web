# Controls all of the albums that a user uploads.
class AlbumsController < ApplicationController

	# Shows an album
	def show

		@album = Album.find_by_token(params[:album_token])
		@user = User.find_by_id(@album.user_id)
		@top_string='<span id="album-name">'+@album.name+"</span> by "+@user.name.split(/(\W)/).map(&:capitalize).join



	end

end
