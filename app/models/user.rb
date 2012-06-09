# The model that holds information about a user. A user is defined as someone with a login account/password name.
# Note: It is possible to view albums without a username, provided you have been given the link.
#
class User < ActiveRecord::Base
	has_many :albums
	validates :email, presence: true, uniqueness: true
	has_secure_password

	# Returns a user's albums
	def self.albums 
		return Album.find_by_user_id(self.id)
	end
end
