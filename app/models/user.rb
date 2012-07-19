# The model that holds information about a user. A user is defined as someone with a login account/password name.
# Note: It is possible to view albums without a username, provided you have been given the link.
#
class User < ActiveRecord::Base
	has_many :albums
	has_many :captures, :through => :albums
	validates :email, presence: true, uniqueness: true
	validates :password, presence: true
	attr_accessible :name, :email, :password, :address, :city, :zip, :state
	
	def self.authenticate(email,password)
		User.where(:email => email, :password => password).first
	end


end
