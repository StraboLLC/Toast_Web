# The unifying interface for a user's videos, photos and other content. Photos and Videos
# are sorted by which album they are in.
class Album < ActiveRecord::Base
	belongs_to :user
	has_many :photos
	has_many :videos

	# Returns all photos and videos from an album. Always returns an array, but the array may be empty.
	def all_media
		a = Array.new
		p = Photo.find_by_album_id(self.id)
		if !p.nil?
			p.each do |x| 
				a.push x 
			end
		end

		v = Video.find_by_album_id(self.id)
		if !v.nil?
			v.each do |x| 
				a.push x 
			end
		end
		a.sort! {|x,y| x.created_at <=> y.created_at } 
	end

	# Returns all photos that are part of an Album. Returns an array or nil if there are no Photos.
	def photos
		return Photo.find_by_album_id(self.id)
	end

	# Returns all videos that are part of an Album. Returns an array or nil if there are no Videos.
	def videos
		return Video.find_by_album_id(self.id)
	end
end
