class Album < ActiveRecord::Base
	belongs_to :user
	has_many :captures

end
