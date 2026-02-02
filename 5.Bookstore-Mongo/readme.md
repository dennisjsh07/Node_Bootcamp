## Basic transaction pattern

    const session = await mongoose.startSession();

    try {
    session.startTransaction();

    // operations here

    await session.commitTransaction();
    session.endSession();
    } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
    }
