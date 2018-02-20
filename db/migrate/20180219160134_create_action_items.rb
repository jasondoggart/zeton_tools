class CreateActionItems < ActiveRecord::Migration[5.1]
  def change
    create_table :action_items do |t|
      t.integer :priority
      t.string :area
      t.text :title
      t.datetime :target_date
      t.datetime :completion_date
      t.string :sent_by
      t.string :description
      t.string :text

      t.timestamps
    end
  end
end
