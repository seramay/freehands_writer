Rails.application.routes.draw do
  resources :posts, except: :index
  root to: "posts#index"
end
