module.exports = {
    find,
    findAll,
    findWithData,
    findAndCountAll,
    update,
    insert
};

async function find(modelName, whereClause, orderBy, transaction = null, paranoid = true) {
    return await modelName.findOne({
        where: whereClause,
        order: orderBy,
        transaction,
        paranoid: paranoid,
    });
}

async function findAll(modelName, whereClause, attributes = ["*"]) {
    return await modelName.findAll({
        where: whereClause,
        attributes: attributes
    });
}

async function findWithData(
    modelName,
    whereClause,
    attributes,
    include = null,
    transaction = null
) {
    return await modelName.findOne({
        where: whereClause,
        attributes: attributes,
        include: include,
        transaction: transaction
    });
}

async function findAndCountAll(
    modelName,
    whereClause,
    orderBy,
    offset,
    limit,
    include,
    attributes,
    groupBy,
    raw,
    nest
) {
    return await modelName.findAndCountAll({
        where: whereClause,
        order: orderBy,
        offset: offset,
        limit: limit,
        include: include,
        attributes: attributes,
        group: groupBy,
        raw: raw,
        nest: nest,
        distinct: true
    });
}

async function update(modelName, dataToUpdate, whereClause, transaction = null, returning = true) {
    return await modelName.update(dataToUpdate, {
        where: whereClause,
        returning: returning,
        plain: true, // condition for updating
        transaction: transaction, // Pass null to indicate not using a transaction
    });
}

async function insert(modelName, dataToInsert, transaction = null, raw = null) {
    return await modelName.create(dataToInsert, {
        transaction: transaction, // Pass null to indicate not using a transaction
        returning: true, // Return the inserted record(s)
        raw: raw
    });
}