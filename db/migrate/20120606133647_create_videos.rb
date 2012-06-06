class CreateVideos < ActiveRecord::Migration
	def change
		create_table :videos do |t|
			t.string :name
			t.text :description
			t.string :url
			t.references :album
			t.decimal :size
			t.decimal :length
			t.integer :plays
			t.timestamps
		end
	end
end
