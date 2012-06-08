require "digest"
# Controls all of the albums that a user uploads.
class AlbumsController < ApplicationController
	# Show a user's albums.
	def index
		if(session[:user_id])
			@user = User.find_by_id(session[:user_id] )
			@albums = Album.find_by_user_id(session[:user_id]) || Array.new
			render action: "index"
		else 
			redirect_to login_url
		end
	end
	# Create a new Album
	def new
		if(session[:user_id])
			@user = User.find_by_id(session[:user_id])
			@album = Album.new
		else
			redirect_to login_url
		end

	end
	# Shows an album
	def show
		if(session[:user_id])
			@user = User.find_by_id(session[:user_id])
		end
		@album = Album.find_by_album_token(params[:album_token])
		@top_string=@album.name


	end
	# Processes the creation of a new album
	def create
		if(session[:user_id])
			@album = Album.new params[:album]
			@album.user_id = session[:user_id]
			hash = @album.user_id.to_s+Time.now.to_i.to_s
			@user = User.find_by_id(session[:user_id] )
			@album.album_token = Digest::MD5.hexdigest(hash).to_s
			if @album.save
				redirect_to profile_path
			else
				render action: "new"
			end
		else 
			redirect_to login_url
		end
	end

	def destroy



	end
end
