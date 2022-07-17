import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from sklearn.ensemble import RandomForestRegressor
from matplotlib import pyplot as plt
import pickle


def show(train, rf):
    sort = rf.feature_importances_.argsort()
    names = list(train.columns.values)
    scores = rf.feature_importances_[sort]
    plt.barh(list(train.columns.values), rf.feature_importances_[sort])
    plt.xlabel("Feature Importance")
    plt.show()
    for i in range(len(names)):
        print(names[i], ": ", scores[i])


if __name__ == '__main__':
    train = pd.read_csv('covid_data_train.csv', sep=';', decimal=',')
    train = train.fillna(0)
    y = train.inf_rate
    columns_to_drop = ['name', 'district', 'region_x', 'subject', 'Unnamed: 0', 'inf_rate']
    for column in columns_to_drop:
        train.drop(column, inplace=True, axis=1)
    X = train
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

    rf = RandomForestRegressor(n_estimators=150, criterion="absolute_error", oob_score=True)
    rf.fit(X_train, y_train)

    print("valid")
    print(mean_absolute_error(y_test.values.tolist(), rf.predict(X_test)))
    print("all")
    print(mean_absolute_error(y.values.tolist(), rf.predict(X)))

    filename = 'inf_rate_model_has_metro_pickaim.pickaim'
    pickle.dump(rf, open(filename, 'wb'))
