class Album < ActiveRecord::Base
	belongs_to :user


	
	# Returns a user's albums
	def captures 
		return Capture.find_by_album_id(@id)
	end
end
