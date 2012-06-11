class Add < ActiveRecord::Migration
  def change
	  change_table :albums do |t|
	    t.references :user
	  end
	  change_table :captures do |t|
	    t.references :album
	  end
	end
end
