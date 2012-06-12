class CreateDb < ActiveRecord::Migration
	def change
		create_table :users do |t|
			t.string :name, :null => false
			t.string :email, :null => false
			t.string :password, :null => false
			t.string :address
			t.string :city
			t.string :state
			t.string :zip
			t.datetime :paid_at
			t.datetime :expires_at
			t.timestamps
		end
		create_table :albums do |t|
			t.string :name
			t.boolean :public, :default => false
			t.string :cover, :default => "red"
			t.string :token, :null => false
			t.references :user, :null => false
			t.datetime :taken_at
			t.timestamps
		end
		create_table :captures do |t|
			t.string :title, :null => false
			t.string :token, :null => false
			t.text :description
			t.decimal :latitude
			t.decimal :longitude
			t.text :description
			t.string :media_type
			t.string :job_id
			t.string :mp4_id
			t.string :webm_id
			t.boolean :encoding_finished
			t.boolean :mp4_finished
			t.boolean :webm_finished
			t.datetime :taken_at
			t.references :album
			t.timestamps
		end
	end
end
