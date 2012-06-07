class User < ActiveRecord::Base
	has_many :albums
	validates :email, presence: true, uniqueness: true
	has_secure_password


end
