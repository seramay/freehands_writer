class Post < ApplicationRecord
  # no Association
  validates :title, presence: true
  validates :content, presence: true
end
