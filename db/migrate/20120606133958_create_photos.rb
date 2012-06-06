class CreatePhotos < ActiveRecord::Migration
	def change
		create_table :photos do |t|
			t.string :name
			t.text :description
			t.decimal :latitude
			t.decimal :longitude
			t.references :album
			t.decimal :size
			t.integer :views
			t.timestamps
		end
		add_column :videos, :latitude, :decimal
		add_column :videos, :longitude, :decimal
	end
end
