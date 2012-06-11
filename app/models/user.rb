# The model that holds information about a user. A user is defined as someone with a login account/password name.
# Note: It is possible to view albums without a username, provided you have been given the link.
#
class User < ActiveRecord::Base
	has_many :albums
	has_many :captures, :through => :albums
	validates :email, presence: true, uniqueness: true
	validates :password, presence: true

	# Returns a user's albums
	def albums 
		return Album.find_by_user_id(@id)
	end
	def self.authenticate(email,password)
		User.where(:email => email, :password => password).first
	end


end
